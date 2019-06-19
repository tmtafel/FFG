import { Component, OnInit } from '@angular/core';
import { PgatourService } from 'src/app/services/pgatour.service';
import { Course } from 'src/app/interfaces/Course';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  course: Course;
  courseReady = false;
  constructor(private pgatourService: PgatourService) { }

  ngOnInit() {
    this.getCourse();
  }

  getCourse(): void {
    this.pgatourService.getCourseData().subscribe(courseData => {
      if (courseData) {
        this.course = courseData.courses[0];
        this.courseReady = true;
      }
    });
  }
}
