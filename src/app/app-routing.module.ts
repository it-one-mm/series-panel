import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';


const routes: Routes = [
  {
    path: 'movies',
    loadChildren: () => import('./movies/movies.module').then(m => m.MoviesModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule)
  },
  {
    path: 'play-lists',
    loadChildren: () => import('./play-lists/play-lists.module').then(m => m.PlayListsModule)
  },
  {
    path: 'languages',
    loadChildren: () => import('./languages/languages.module').then(m => m.LanguagesModule)
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    paramsInheritanceStrategy: 'always'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
