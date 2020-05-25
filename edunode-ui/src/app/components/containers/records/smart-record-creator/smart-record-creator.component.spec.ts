import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {TestStore} from '../../../../store/test/test.store';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {RecordCreatorActionTypes, SmartRecordCreatorComponent} from './smart-record-creator.component';
import {selectFilesStateIsUploadingFiles, selectUploadedFiles} from '../../../../store/reducers/files.reducer';
import {selectStudents, selectStudentsStateIsLoading} from '../../../../store/reducers/students.reducer';
import {GetStudents} from '../../../../store/actions/students.actions';
import {of} from 'rxjs';
import {ClearUploadedFiles, UploadMultipleFiles} from '../../../../store/actions/files.actions';
import {EduStudentModel} from '../../../../core/models/students/edu-student.model';

describe('SmartRecordCreatorComponent', () => {
  let component: SmartRecordCreatorComponent;
  let fixture: ComponentFixture<SmartRecordCreatorComponent>;
  let mockStore;
  let router: Router;

  beforeEach(async(() => {
    mockStore = new TestStore();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        {path: 'records', component: SmartRecordCreatorComponent},
        {path: '', component: SmartRecordCreatorComponent}
      ])],
      declarations: [SmartRecordCreatorComponent],
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
    fixture = TestBed.createComponent(SmartRecordCreatorComponent);
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
    expect(mockStore.select).toHaveBeenCalledWith(selectFilesStateIsUploadingFiles);
    expect(mockStore.select).toHaveBeenCalledWith(selectStudentsStateIsLoading);
    expect(mockStore.select).toHaveBeenCalledWith(selectStudents);
    expect(mockStore.select).toHaveBeenCalledWith(selectUploadedFiles);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new ClearUploadedFiles());
    expect(mockStore.dispatch).toHaveBeenCalledWith(new GetStudents());
  });

  it('Actions button should be to set to valid on valid form data', () => {
    const student: EduStudentModel = {
      publicKey: '1',
      faculty: 'test',
      groupId: '30441',
      fullName: 'test'
    };
    component.latestAvailableStudents = [student];
    component.ngOnInit();
    expect(component.actions[1].valid).toBe(false);
    component.latestAvailableStudents = [student];
    component.form.patchValue({
      recordTitle: 'r1',
      selectedStudent: student,
      attachments: ['a1', 'a2']
    });
    expect(component.isCreating).toBe(false);
    expect(component.form.valid).toBe(true);
    expect(component.actions[1].valid).toBe(true);
  });

  it('should dispatch files and start creation on Create Event', () => {
    component.ngOnInit();
    spyOn(mockStore, 'dispatch');
    expect(component.isCreating).toBe(false);
    component.files = [];
    component.onAction(RecordCreatorActionTypes.CREATE);
    expect(component.isCreating).toBe(true);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new UploadMultipleFiles([]));
  });

  it('should navigate back to records on Exit Event', () => {
    spyOn(router, 'navigateByUrl');
    component.onAction(RecordCreatorActionTypes.EXIT);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/records');
  });
});
