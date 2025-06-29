import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private editableSubject = new BehaviorSubject<boolean>(false);
  editable$ = this.editableSubject.asObservable();

  setEditable(value: boolean) {
    this.editableSubject.next(value);
  }

  getEditable(): boolean {
    return this.editableSubject.value;
  }
}
