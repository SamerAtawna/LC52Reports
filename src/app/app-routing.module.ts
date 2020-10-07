import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardGuard } from "./Guard/auth-guard.guard";
import { LoginComponent } from "./login/login.component";
import { MainComponent } from "./main/main.component";
import { ProdAmountReportComponent } from "./prod-amount-report/prod-amount-report.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "main", component: MainComponent },
  {
    path: "reports",
    component: ProdAmountReportComponent,
    canActivate: [AuthGuardGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
