import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {TestStore} from '../../../../store/test/test.store';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {AddNetworkMemberActionTypes, SmartAddNetworkMemberComponent} from './smart-add-network-member.component';
import {AddNetworkMemberModel} from '../../../../core/models/network/add-network-member.model';
import {AddNetworkMember} from '../../../../store/actions/network-members.actions';

describe('SmartAddNetworkMemberComponent', () => {
  let component: SmartAddNetworkMemberComponent;
  let fixture: ComponentFixture<SmartAddNetworkMemberComponent>;
  const mockStore = new TestStore();
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        {path: 'network', component: SmartAddNetworkMemberComponent},
        {path: '', component: SmartAddNetworkMemberComponent}
      ])],
      declarations: [SmartAddNetworkMemberComponent],
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
    fixture = TestBed.createComponent(SmartAddNetworkMemberComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make actions button active on valid form data', () => {
    component.ngOnInit();
    component.form.patchValue({
      publicKey: 'some-random-pk',
      legalIdentity: 'some-random-legal-identity',
      host: 'localhost',
      port: 3535
    });
    expect(component.actions[1].valid).toBe(true);
  });

  it('should make actions button inactive on invalid form data', () => {
    component.ngOnInit();
    component.form.patchValue({
      publicKey: null,
      legalIdentity: 'some-random-legal-identity',
      host: 'localhost',
      port: 3535
    });
    expect(component.actions[1].valid).toBe(false);
  });

  it('should navigate to /network on AddNetworkMemberActionTypes.Exit event', () => {
    component.ngOnInit();
    spyOn(router, 'navigateByUrl');
    component.onAction(AddNetworkMemberActionTypes.Exit);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/network');
  });

  it('should dispatch action on AddNetworkMemberActionTypes.Add event', () => {
    spyOn(mockStore, 'dispatch');
    component.ngOnInit();
    component.form.patchValue({
      publicKey: 'some-random-pk',
      legalIdentity: 'some-random-legal-identity',
      host: 'localhost',
      port: 3535
    });
    component.onAction(AddNetworkMemberActionTypes.Add);
    const payload: AddNetworkMemberModel = {
      publicKey: 'some-random-pk',
      legalIdentity: 'some-random-legal-identity',
      host: 'localhost',
      port: 3535,
    };
    expect(mockStore.dispatch).toHaveBeenCalledWith(new AddNetworkMember(payload));
  });
});
