import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, combineLatest } from "rxjs";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from 'src/app/core/services/product.service';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { handleError } from 'src/app/shared/utils/error-handling.function';

@Component({
    selector: "app-products-add-edit",
    templateUrl: './products-add-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsAddEditComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    productForm: FormGroup;
    id: number;
    appliedFilters: any = {};
    category: any;
    subCategory: any;
    isOptionSelected: boolean = false;

    constructor(
        private readonly fb: UntypedFormBuilder,
        private readonly productService: ProductService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private snackBar: MatSnackBar
    ) {
        this.subscribeForQueryParams();
    }

    ngOnInit(): void {
        this.retrieveCategory();
    }

    retrieveCategory(): void {
        const data = {
            "start": 0,
            "length": 0,
            "filters": ["", "", "", ""],
            "order": [{ "dir": "DESC", "column": 0 }]
        };
        this.productService.getCategory(data).subscribe({
            next: response => {
                this.category = response;
                this.isLoading$.next(false);
            },
            error: err => {
                this.isLoading$.next(false);
                console.error('Error fetching categories:', err);
            }

        });
    }

    onCategoryChange(ev: any): void {
        this.isLoading$.next(true);
        const selectedCategoryId = Number(ev.target.value);
        const category = this.category.find((item: any) => Number(item.attributes.id) === selectedCategoryId);

        if (category) {
            this.productForm.patchValue({ categoryId: category.attributes.id });
            this.retrieveSubCategories(category.attributes.id);
        } else {
            this.isLoading$.next(false);
        }
    }

    retrieveSubCategories(categoryId: any): void {
        this.productService.getSubCategory(categoryId).subscribe({
            next: res => {
                this.subCategory = res.map((item: any) => item.attributes) || [];
                if (this.subCategory.length === 0) {
                    this.productForm.patchValue({ subCategoryId: null });
                }
                this.isLoading$.next(false);
            },
            error: err => {
                this.isLoading$.next(false);
            }
        });
    }

    subscribeForQueryParams(): void {
        this.id = this.route.snapshot.params['id'];
        if (this.id) {
            combineLatest([
                this.productService.get(this.id)
            ]).subscribe(([product]: [any]) => {
                this.retrieveSubCategories(product?.category?.id)
                this.initForm(product);
                this.isOptionSelected = true;
                this.isLoading$.next(false);
            });
        } 
        else {
            this.initForm();
            this.isLoading$.next(false);
        }
    }

    applyFilter(target: any, column: string): void {
        if (typeof target.value !== 'object' && (target.value || typeof target.value === 'boolean')) {
            this.appliedFilters[column] = target.value;
        } else {
            delete this.appliedFilters[column];
        }
    }

    initForm(data: any = <any>{}): void {
        this.productForm = this.fb.group({
            type: this.fb.control(data?.type || '', [...createRequiredValidators()]),
            productCode: this.fb.control(data?.productCode || '', [...createRequiredValidators()]),
            name: this.fb.control(data?.name || '', [...createRequiredValidators()]),
            categoryId: this.fb.control(data?.category?.id || '', [...createRequiredValidators()]),
            subCategoryId: this.fb.control(data?.subCategory?.id || '', [...createRequiredValidators()]),
        });
        if (data?.type) {
            this.isOptionSelected = true;
        }
    }

    saveProduct(): void {
        this.isLoading$.next(true);
        const parsedData = this.parseData(this.productForm.value);

        if (this.id) {
            this.productService.edit(this.id, parsedData).subscribe({
                next: () => {
                    this.isLoading$.next(false);
                    this.router.navigate(['../../success'], { relativeTo: this.route });
                },
                error: (body: any) => {
                    this.isLoading$.next(false);
                    handleError(this.snackBar, body, this.isLoading$);
                }
            });
        } else {
            this.productService.create(parsedData).subscribe({
                next: () => {
                    this.isLoading$.next(false);
                    this.router.navigate(['../success'], { relativeTo: this.route });
                },
                error: (body: any) => {
                    this.isLoading$.next(false);
                    handleError(this.snackBar, body, this.isLoading$);
                }
            });
        }
    }

    private parseData(data: any): any {
        if (!data.productId) delete data.productId;
        if (data.categoryId) data.categoryId = Number(data.categoryId);
        if (data.subCategoryId) data.subCategoryId = Number(data.subCategoryId);
        return data;
    }

    selectOption(type: string): void {
        this.productForm.patchValue({ type });
        this.isOptionSelected = true;
    }
}
