import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Meal } from "../Models/Meal";
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from "@angular/router";

const api = "http://10.109.208.27:5000";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  public $isLoggedIn = new BehaviorSubject(false);
  public $loggedResturant = new BehaviorSubject<any>(null);

  public isLogged = false;

  constructor(private http: HttpClient, private router: Router) {}

  getData(from, to): Observable<Meal[]> {
    console.log("fromto ", from, to);
    // return this.http.get<Meal[]>(`../../assets/data.json`);
    return this.http.get<Meal[]>(`${api}/getmealscount?from=${from}&to=${to}`);
  }

  getDataToday() {
    return this.http.get<Meal[]>(`${api}/getmealstoday`);
  }

  getResturants() {
    // return this.http.get(`../../assets/resturants.json`);
    return this.http.get(`${api}/data`);
  }

  login(resturant) {
    this.isLogged = true;
    this.$loggedResturant.next(resturant);
    this.$isLoggedIn.next(true);
    this.router.navigateByUrl("/reports");
  }

  logOut() {
    this.isLogged = false;
    this.$isLoggedIn.next(false);
    this.router.navigateByUrl("");
  }
}
