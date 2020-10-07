import { Component, OnInit } from "@angular/core";
import { ApiService } from "../Services/api.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  isLoggedIn = false;
  loggedRest = "";
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.$isLoggedIn.subscribe((log) => (this.isLoggedIn = log));
    this.api.$loggedResturant.subscribe((rest) => (this.loggedRest = rest));
  }

  logout() {
    this.api.logOut();
  }
}
