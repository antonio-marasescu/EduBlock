import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {TestStore} from '../../../../store/test/test.store';
import {SmartNavigationBarComponent} from './smart-navigation-bar.component';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {GetNetworkPersonalIdentity} from '../../../../store/actions/network-members.actions';
import {GetCurrentUser, LogoutUser} from '../../../../store/actions/auth.actions';

describe('SmartNavigationBarComponent', () => {
  let component: SmartNavigationBarComponent;
  let fixture: ComponentFixture<SmartNavigationBarComponent>;
  const mockStore = new TestStore();
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        {path: 'login', component: SmartNavigationBarComponent},
        {path: '', component: SmartNavigationBarComponent}
      ])],
      declarations: [SmartNavigationBarComponent],
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
    fixture = TestBed.createComponent(SmartNavigationBarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch actions on whitelisted url on ngOnInit', () => {
    spyOn(mockStore, 'dispatch');
    router.navigateByUrl('/login');
    component.ngOnInit();
    expect(mockStore.dispatch).toHaveBeenCalledWith(new GetCurrentUser(false));
    expect(mockStore.dispatch).toHaveBeenCalledWith(new GetNetworkPersonalIdentity());
  });

  it('should not dispatch actions on a non-whitelisted url on ngOnInit', () => {
    spyOn(mockStore, 'dispatch');
    router.navigateByUrl('/');
    component.ngOnInit();
    expect(mockStore.dispatch).toHaveBeenCalledWith(new GetCurrentUser(false));
    expect(mockStore.dispatch).toHaveBeenCalledWith(new GetNetworkPersonalIdentity());
  });

  it('should dispatch logout action on logout event', () => {
    spyOn(mockStore, 'dispatch');
    component.onLogout();
    expect(mockStore.dispatch).toHaveBeenCalledWith(new LogoutUser());
  });
});
