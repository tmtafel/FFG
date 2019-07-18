import { Component, OnInit } from '@angular/core';
import { Router, Route } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  routes: string[];
  constructor(private router: Router) { }

  ngOnInit() {
    this.routes = [];
    this.printpath('', this.router.config);
  }
  printpath(parent: string, config: Route[]) {
    config.forEach(element => {
      const route = element;
      this.routes.push(parent + '/' + route.path);
      if (route.children) {
        const currentPath = route.path ? parent + '/' + route.path : parent;
        this.printpath(currentPath, route.children);
      }
    });
  }

  getRouteName(routeName: string): string {
    return routeName.replace('/', ' ').trim();
  }
}
