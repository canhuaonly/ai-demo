import { Injectable, InjectionToken, Pipe,PipeTransform } from "@angular/core";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RepeatPipeConfig {}
export const REPEAT_PIPE_CONFIG_TOKEN = new InjectionToken<RepeatPipeConfig>(
  'RepeatPipeConfig'
);

@Pipe({
    name:'markdown',
    standalone:true
})
@Injectable({
    providedIn: 'root'
  })
export class RepeatPipe implements PipeTransform{
    // private repeatPipeConfig = inject(REPEAT_PIPE_CONFIG_TOKEN, { optional: true });
    transform(value: string): string {  
        if (!value) return '';
        let repeatValue = value
        repeatValue = repeatValue.replaceAll("<code>", "<code class='code'>")
        // repeatValue = repeatValue.replaceAll('<code class="', '<code class="code ')
        repeatValue = repeatValue.replaceAll("<pre>", "<pre class='code'>")
        return repeatValue;
    }
}
