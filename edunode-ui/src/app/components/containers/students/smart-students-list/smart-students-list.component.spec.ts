import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {TestStore} from '../../../../store/test/test.store';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import {selectStudents, selectStudentsStateIsLoading} from '../../../../store/reducers/students.reducer';
import {GetStudents} from '../../../../store/actions/students.actions';
import {SmartStudentsListComponent, StudentsListActionTypes} from './smart-students-list.component';

describe('SmartStudentsListComponent', () => {
  let component: SmartStudentsListComponent;
  let fixture: ComponentFixture<SmartStudentsListComponent>;
  let mockStore;
  let router: Router;

  beforeEach(async(() => {
    mockStore = new TestStore();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        {path: 'records/create', component: SmartStudentsListComponent}
      ])],
      declarations: [SmartStudentsListComponent],
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
    fixture = TestBed.createComponent(SmartStudentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit()', () => {
    spyOn(mockStore, 'select').and.returnValue(of([]));
    spyOn(mockStore, 'dispatch');
    component.ngOnInit();
    expect(mockStore.select).toHaveBeenCalledWith(selectStudents);
    expect(mockStore.select).toHaveBeenCalledWith(selectStudentsStateIsLoading);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new GetStudents());
  });

  it('should navigate to student creation on Add Student Event', () => {
    spyOn(router, 'navigateByUrl');
    component.onAction(StudentsListActionTypes.ADD_STUDENT);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/students/create');
  });
});
