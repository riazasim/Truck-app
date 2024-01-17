import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import SwiperCore, { Keyboard, Navigation, Pagination  } from 'swiper';

import { OnboardingSlideComponent } from './onboarding-slide/onboarding-slide.component';
import { OnboardingSlideshowComponent } from './onboarding-slideshow/onboarding-slideshow.component';

SwiperCore.use([Navigation, Pagination, Keyboard]);

@NgModule({
  declarations: [OnboardingSlideComponent, OnboardingSlideshowComponent],
  imports: [CommonModule],
  exports: [OnboardingSlideComponent, OnboardingSlideshowComponent],
})
export class OnboardingSlideModule {}
