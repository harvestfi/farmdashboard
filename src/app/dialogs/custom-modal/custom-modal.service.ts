import { Injectable, ComponentFactoryResolver, Injector, Inject, TemplateRef, Type } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CustomModalComponent } from './custom-modal.component';
export type Content<T> = string | TemplateRef<T> | Type<T>;

@Injectable()
export class CustomModalService {
    
  constructor(private resolver: ComponentFactoryResolver,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) { }

  openModal<T>(content: Content<T>) {
    const factory = this.resolver.resolveComponentFactory(CustomModalComponent);
    const ngContent = this.resolveNgContent(content);
    const componentRef = factory.create(this.injector, ngContent);
    componentRef.hostView.detectChanges();

    const { nativeElement } = componentRef.location;
    console.log(nativeElement);
    this.document.body.appendChild(nativeElement);
    document.body.classList.add('custom-modal-open');

  }

  resolveNgContent<T>(content: Content<T>) {
    if (typeof content === 'string') {
      const element = this.document.createTextNode(content);
      return [[element]];
    }

    if (content instanceof TemplateRef) {
      const viewRef = content.createEmbeddedView(null);
      return [viewRef.rootNodes];
    }
    
    const factory = this.resolver.resolveComponentFactory(content);
    const componentRef = factory.create(this.injector);
    return [[componentRef.location.nativeElement]];
  }

}
