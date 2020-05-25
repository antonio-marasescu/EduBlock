import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {TestStore} from '../../../../store/test/test.store';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {NetworkMembersActionTypes, SmartNetworkMembersComponent} from './smart-network-members.component';
import {
  selectNetworkMembers,
  selectNetworkMembersStateIsLoading
} from '../../../../store/reducers/network-members.reducer';
import {GetNetworkMembers, LearnNetworkMembers} from '../../../../store/actions/network-members.actions';

describe('SmartNetworkMembersComponent', () => {
  let component: SmartNetworkMembersComponent;
  let fixture: ComponentFixture<SmartNetworkMembersComponent>;
  const mockStore = new TestStore();
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        {path: 'network', component: SmartNetworkMembersComponent},
        {path: '', component: SmartNetworkMembersComponent}
      ])],
      declarations: [SmartNetworkMembersComponent],
      providers: [
        {
          provide: Store,
          useValue: mockStore
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(SmartNetworkMembersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit()', () => {
    spyOn(mockStore, 'select');
    spyOn(mockStore, 'dispatch');
    component.ngOnInit();
    expect(mockStore.select).toHaveBeenCalledWith(selectNetworkMembersStateIsLoading);
    expect(mockStore.select).toHaveBeenCalledWith(selectNetworkMembers);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new GetNetworkMembers());
  });

  it('should navigate to add network member component on NetworkMembersActionTypes.Add event', () => {
    spyOn(router, 'navigateByUrl');
    component.onAction(NetworkMembersActionTypes.Add);
    expect(router.navigateByUrl).toHaveBeenCalledWith('network/add');
  });

  it('should dispatch action on AddNetworkMemberActionTypes.Add event', () => {
    spyOn(mockStore, 'dispatch');
    component.onAction(NetworkMembersActionTypes.Refresh);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new LearnNetworkMembers());
  });
});
