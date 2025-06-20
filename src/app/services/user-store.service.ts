import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
private hpcsaNumber$ = new BehaviorSubject<string>("");
private role$ = new BehaviorSubject<string>("");

  constructor() { }

  public getRoleFromStore(){
    return this.role$.asObservable();
  }

  public setRoleForStore(role:string){
    this.role$.next(role);
  }

  public getHpcsaNumberFromStore(){
    this.hpcsaNumber$.asObservable();
  }

  public setHpcsaNumberForStore(hpcsanumber:string){
    this.hpcsaNumber$.next(hpcsanumber);
  }

}


