import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SmartNetworkMembersComponent} from './components/containers/network/smart-network-members/smart-network-members.component';
import {SmartAddNetworkMemberComponent} from './components/containers/network/smart-add-network-member/smart-add-network-member.component';
import {SmartRecordsListComponent} from './components/containers/records/smart-records-list/smart-records-list.component';
import {SmartRecordCreatorComponent} from './components/containers/records/smart-record-creator/smart-record-creator.component';
import {SmartRecordDetailsComponent} from './components/containers/records/smart-record-details/smart-record-details.component';
import {SmartStudentsListComponent} from './components/containers/students/smart-students-list/smart-students-list.component';
import {SmartStudentCreatorComponent} from './components/containers/students/smart-student-creator/smart-student-creator.component';
import {AuthGuard} from './core/guards/auth.guard';
import {SmartAuthPageComponent} from './components/containers/auth/smart-auth-page/smart-auth-page.component';
import {SmartRegisterPageComponent} from './components/containers/auth/smart-register-page/smart-register-page.component';


const routes: Routes = [
  {path: '', redirectTo: '/network', pathMatch: 'full'},
  {path: 'login', component: SmartAuthPageComponent},
  {path: 'register', component: SmartRegisterPageComponent},
  {
    path: 'network',
    component: SmartNetworkMembersComponent,
    canActivate: [AuthGuard],
    data: {roles: ['User', 'Admin']}
  },
  {
    path: 'network/add',
    component: SmartAddNetworkMemberComponent,
    canActivate: [AuthGuard],
    data: {roles: ['User', 'Admin']}
  },
  {path: 'records', component: SmartRecordsListComponent, canActivate: [AuthGuard], data: {roles: ['User', 'Admin']}},
  {
    path: 'records/create',
    component: SmartRecordCreatorComponent,
    canActivate: [AuthGuard],
    data: {roles: ['User', 'Admin']}
  },
  {
    path: 'records/:id',
    component: SmartRecordDetailsComponent,
    canActivate: [AuthGuard],
    data: {roles: ['User', 'Admin']}
  },
  {path: 'students', component: SmartStudentsListComponent, canActivate: [AuthGuard], data: {roles: ['User', 'Admin']}},
  {
    path: 'students/create',
    component: SmartStudentCreatorComponent,
    canActivate: [AuthGuard],
    data: {roles: ['User', 'Admin']}
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
