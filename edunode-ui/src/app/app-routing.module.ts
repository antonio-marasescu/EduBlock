import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SmartNetworkMembersComponent} from './components/containers/network/smart-network-members/smart-network-members.component';
import {SmartAddNetworkMemberComponent} from './components/containers/network/smart-add-network-member/smart-add-network-member.component';
import {SmartRecordsListComponent} from './components/containers/records/smart-records-list/smart-records-list.component';
import {SmartRecordCreatorComponent} from './components/containers/records/smart-record-creator/smart-record-creator.component';


const routes: Routes = [
  {path: '', redirectTo: '/network', pathMatch: 'full'},
  {path: 'network', component: SmartNetworkMembersComponent},
  {path: 'network/add', component: SmartAddNetworkMemberComponent},
  {path: 'records', component: SmartRecordsListComponent},
  {path: 'records/create', component: SmartRecordCreatorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
