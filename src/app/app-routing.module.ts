// import { AboutComponent } from './components/about/about.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from './components/baseLayout/baseLayout.component';

const routes: Routes = [
    {
        path: '',
        component: BaseLayoutComponent
    }
    // {
    //     path: 'about',
    //     component: AboutComponent
    // },
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
