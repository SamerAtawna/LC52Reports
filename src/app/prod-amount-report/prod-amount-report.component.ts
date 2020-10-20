import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { Sort } from "@angular/material/sort";
import { Meal } from "../Models/Meal";
import { ApiService } from "../Services/api.service";
import { filter, tap } from "rxjs/operators";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import * as XLSX from "xlsx";

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
  resturants = [];
  dataFiltered;
  fileName = "LC52Report.xlsx";
  constructor(private api: ApiService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.api.$loggedResturant.subscribe((rest) => {
      this.loggedRest = rest;
    });
    this.dateForm = new FormGroup({
      from: new FormControl("", { validators: Validators.required }),
      to: new FormControl("", { validators: Validators.required }),
    });
    this.api.getResturants().subscribe((res: any) => {
      this.resturants = res;
      console.log("res ", res);
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
    this.resultsActive = true;
    this.isLoading = true;
    this.api.getData(from, to).subscribe((w: Meal[]) => {
      this.dataFiltered = w;
      if (!(this.loggedRest === "admin")) {
        this.dataSource = w.filter((m) => {
          return m.Resturant === this.loggedRest;
        });
      } else {
        this.dataSource = w;
      }
      this.isLoading = false;
      this.sortedData = this.dataSource.slice();
      this.length = this.dataSource.length;

      this.totalMeals = this.dataSource.reduce((a, b: Meal) => {
        return a + b.Count;
      }, 0);
    });
  }

  sortData(sort: Sort) {
    const data = this.sortedData.slice();
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
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  showToday() {
    this.resultsActive = true;
    this.isLoading = true;
    this.api.getDataToday().subscribe((w: Meal[]) => {
      this.dataFiltered = w;
      console.log("w ", w);
      console.log("logged ", this.loggedRest);
      if (!(this.loggedRest === "admin")) {
        this.dataSource = w.filter((m) => {
          return m.Resturant === this.loggedRest;
        });
      } else {
        this.dataSource = w;
      }
      this.isLoading = false;
      this.sortedData = this.dataSource.slice();
      this.length = this.dataSource.length;
      console.log("sorted ", this.sortData);
      this.totalMeals = this.sortedData.reduce((a, b: Meal) => {
        return a + b.Count;
      }, 0);
    });
  }
  filterResturants(rest) {
    console.log("rest ", rest);
    this.sortedData = this.dataFiltered.filter((res) => {
      console.log("ProdAmountReportComponent -> filterResturants -> res", res);

      console.log(res.Resturant === rest);
      return res.Resturant === rest;
    });
    console.log(
      "ProdAmountReportComponent -> filterResturants -> this.dataSource",
      this.dataSource
    );
    this.totalMeals = this.sortedData.reduce((a, b: Meal) => {
      return a + b.Count;
    }, 0);
  }

  exportexcel(): void {
    if (this.sortedData.length === 0) {
      this.openSnackBar("קודם יש להפיק דוח ");
      return;
    }
    let element = document.getElementsByTagName("table")[0];
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}
