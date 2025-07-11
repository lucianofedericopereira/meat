import { bootstrapApplication } from '@angular/platform-browser';
import { CounterComponent } from './app/counter.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

bootstrapApplication(CounterComponent, {
  providers: [importProvidersFrom(BrowserModule)]
});
