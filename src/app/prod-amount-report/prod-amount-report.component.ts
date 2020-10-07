import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { Sort } from "@angular/material/sort";
import { Meal } from "../Models/Meal";
import { ApiService } from "../Services/api.service";
import { filter, tap } from "rxjs/operators";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

@Component({
  selector: "app-prod-amount-report",
  templateUrl: "./prod-amount-report.component.html",
  styleUrls: ["./prod-amount-report.component.scss"],
})
export class ProdAmountReportComponent implements OnInit {
  displayedColumns: string[] = ["restaurant", "meal", "amount"];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = [];
  sortedData = [];
  isLoading = false;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  loggedRest = null;
  resultsActive = false;
  totalMeals = 0;
  dateForm: FormGroup;

  constructor(private api: ApiService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.api.$loggedResturant.subscribe((rest) => {
      console.log("rest ", rest);
      this.loggedRest = rest;
    });
    this.dateForm = new FormGroup({
      from: new FormControl("", { validators: Validators.required }),
      to: new FormControl("", { validators: Validators.required }),
    });
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }
  showReport() {
    if (!this.dateForm.valid) {
      this.openSnackBar("יש לבחור תאריכים");
      return;
    }
    let from = this.styleDate(this.dateForm.get("from").value);
    let to = this.styleDate(this.dateForm.get("to").value);
    console.log(from, to);
    this.resultsActive = true;
    console.log("logged ", this.loggedRest);
    this.isLoading = true;
    this.api.getData(from, to).subscribe((w: Meal[]) => {
      console.log("w", w);
      this.dataSource = w.filter((m) => {
        return m.Resturant === this.loggedRest;
      });
      this.isLoading = false;
      this.sortedData = this.dataSource.slice();
      this.length = this.dataSource.length;
      console.log("w", this.dataSource);
      this.totalMeals = this.dataSource.reduce((a, b: Meal) => {
        return a + b.Count;
      }, 0);
    });
  }

  sortData(sort: Sort) {
    console.log(sort);
    const data = this.dataSource.slice();
    if (!sort.active || sort.direction === "") {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "Cot":
          return this.compare(a.Count, b.Count, isAsc);
        case "Rest":
          return this.compare(a.Resturant, b.Resturant, isAsc);
        case "Mel":
          return this.compare(a.Meal, b.Meal, isAsc);
        default:
          return 0;
      }
    });
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(",")
        .map((str) => +str);
    }
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 2000,
      direction: "rtl",
    });
  }

  styleDate(date: Date) {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    console.log(`date styled ${month}-${day}-${year}`);
  }
}
