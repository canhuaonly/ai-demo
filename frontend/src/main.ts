import { enableProdMode, importProvidersFrom } from '@angular/core'
import { environment } from './environments/environment'
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { REPEAT_PIPE_CONFIG_TOKEN, RepeatPipeConfig } from './app/core/utils/markdown.pipe';

if (environment.production) {
    enableProdMode()
    // show this warning only on prod mode
    if (window) {
        selfXSSWarning();
    }
}

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(withFetch()), 
        importProvidersFrom(BrowserModule, AppRoutingModule, HttpClient),
        { provide: REPEAT_PIPE_CONFIG_TOKEN, useValue: {} satisfies RepeatPipeConfig },
    ]
})
    .catch((err) => console.error(err))

function selfXSSWarning() {
    setTimeout(() => {
        console.log('%c** STOP **', 'font-weight:bold; font: 2.5em Arial; color: white; background-color: #e11d48; padding-left: 15px; padding-right: 15px; border-radius: 25px; padding-top: 5px; padding-bottom: 5px;');
        console.log(
            `\n%cThis is a browser feature intended for developers. Using this console may allow attackers to impersonate you and steal your information sing an attack called Self-XSS. Do not enter or paste code that you do not understand.`, 'font-weight:bold; font: 2em Arial; color: #e11d48;'
        );
    });
}
