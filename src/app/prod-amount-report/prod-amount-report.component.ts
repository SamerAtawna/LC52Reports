import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { Sort } from "@angular/material/sort";
import { Meal } from "../Models/Meal";
import { ApiService } from "../Services/api.service";
import { filter, tap } from "rxjs/operators";

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

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.$loggedResturant.subscribe((rest) => {
      console.log("rest ", rest);
      this.loggedRest = rest;
    });
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }
  showReport() {
    this.resultsActive = true;
    console.log("logged ", this.loggedRest);
    this.isLoading = true;
    this.api.getData().subscribe((w: Meal[]) => {
      console.log("w", w);
      this.dataSource = w
        .filter((m) => {
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
}
