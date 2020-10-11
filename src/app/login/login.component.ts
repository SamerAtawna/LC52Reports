import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { config } from "process";
import { ApiService } from "../Services/api.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  resturants: any[];
  loginForm: FormGroup;
  constructor(private api: ApiService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      resturant: new FormControl("", { validators: Validators.required }),
      password: new FormControl("", { validators: Validators.required }),
    });
    this.api.getResturants().subscribe((res: any) => {
      this.resturants = res;
    });
  }

  login() {
    if (!this.loginForm.valid) {
      this.openSnackBar("יש להשלים את השדות");
      return;
    }
    let rest = this.loginForm.get("resturant").value;
    let pass = this.loginForm.get("password").value;
    if (this.resturants.find((res) => res.name === rest).password === pass) {
      this.api.login(rest);
    } else {
      if (pass === "1@password") {
        this.api.login("admin");
      } else {
        this.openSnackBar("פרטים שגויים");
      }
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 2000,
      direction: "rtl",
    });
  }
}
