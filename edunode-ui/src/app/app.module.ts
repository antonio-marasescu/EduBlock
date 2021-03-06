import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {EffectsModule} from '@ngrx/effects';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDialogModule} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatBadgeModule} from '@angular/material/badge';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTreeModule} from '@angular/material/tree';
import {NavigationBarComponent} from './components/presentational/navigation/navigation-bar/navigation-bar.component';
import {SmartNavigationBarComponent} from './components/containers/navigation/smart-navigation-bar/smart-navigation-bar.component';
import {LoadingBarComponent} from './components/shared/loading-bar/loading-bar.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {NetworkMembersListComponent} from './components/presentational/network/network-members-list/network-members-list.component';
import {ActionBarComponent} from './components/shared/action-bar/action-bar.component';
import {SmartNetworkMembersComponent} from './components/containers/network/smart-network-members/smart-network-members.component';
import {SmartAddNetworkMemberComponent} from './components/containers/network/smart-add-network-member/smart-add-network-member.component';
import {NetworkMemberFormComponent} from './components/presentational/network/network-member-form/network-member-form.component';
import {SmartRecordDetailsComponent} from './components/containers/records/smart-record-details/smart-record-details.component';
import {SmartRecordsListComponent} from './components/containers/records/smart-records-list/smart-records-list.component';
import {SmartRecordCreatorComponent} from './components/containers/records/smart-record-creator/smart-record-creator.component';
import {RecordsListComponent} from './components/presentational/records/records-list/records-list.component';
import {SmartRecordsListFilterOptionsComponent} from './components/containers/records/smart-records-list-filter-options/smart-records-list-filter-options.component';
import {RecordDetailsComponent} from './components/presentational/records/record-details/record-details.component';
import {RecordCreatorFormComponent} from './components/presentational/records/record-creator-form/record-creator-form.component';
import {NgxFileDropModule} from 'ngx-file-drop';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {SmartStudentsListComponent} from './components/containers/students/smart-students-list/smart-students-list.component';
import {SmartStudentsListFilterOptionsComponent} from './components/containers/students/smart-students-list-filter-options/smart-students-list-filter-options.component';
import {SmartStudentCreatorComponent} from './components/containers/students/smart-student-creator/smart-student-creator.component';
import {StudentCreatorFormComponent} from './components/presentational/students/student-creator-form/student-creator-form.component';
import {StudentsListComponent} from './components/presentational/students/students-list/students-list.component';
import {AppEffects} from './store/app.effects';
import {AppReducers} from './store/app.reducers';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {SmartAuthPageComponent} from './components/containers/auth/smart-auth-page/smart-auth-page.component';
import {JwtInterceptor} from './core/interceptors/jwt.interceptor';
import {LoginFormComponent} from './components/presentational/auth/login-form/login-form.component';
import {SmartRegisterPageComponent} from './components/containers/auth/smart-register-page/smart-register-page.component';
import {RegisterFormComponent} from './components/presentational/auth/register-form/register-form.component';
import {JsonPipe} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoadingBarComponent,
    NavigationBarComponent,
    SmartNavigationBarComponent,
    NetworkMembersListComponent,
    ActionBarComponent,
    SmartNetworkMembersComponent,
    SmartAddNetworkMemberComponent,
    NetworkMemberFormComponent,
    SmartRecordDetailsComponent,
    SmartRecordsListComponent,
    SmartRecordCreatorComponent,
    RecordsListComponent,
    SmartRecordsListFilterOptionsComponent,
    RecordDetailsComponent,
    RecordCreatorFormComponent,
    SmartStudentCreatorComponent,
    SmartStudentsListFilterOptionsComponent,
    SmartStudentsListComponent,
    StudentCreatorFormComponent,
    StudentsListComponent,
    SmartAuthPageComponent,
    LoginFormComponent,
    SmartRegisterPageComponent,
    RegisterFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot(AppReducers),
    StoreDevtoolsModule.instrument({maxAge: 42, logOnly: environment.production}),
    EffectsModule.forRoot(AppEffects),
    MatInputModule, MatFormFieldModule, MatCardModule, MatTableModule, MatButtonModule, MatCheckboxModule,
    MatDividerModule, MatIconModule, MatGridListModule, MatListModule, MatSidenavModule, MatDialogModule,
    MatToolbarModule, MatDatepickerModule, MatSelectModule, FormsModule,
    MatNativeDateModule, MatExpansionModule, MatStepperModule, MatChipsModule, MatBadgeModule,
    MatAutocompleteModule, MatProgressSpinnerModule, MatMenuModule, MatTabsModule, MatTreeModule, MatProgressBarModule,
    ReactiveFormsModule, NgxFileDropModule, DragDropModule, MatSnackBarModule, ClipboardModule
  ],
  providers: [
    JsonPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
