//抽象观察者
abstract class abstract_observer{
    name: string;
    message: string | undefined;
    constructor(name:string){
        this.name = name;
    }
    abstract handle_publish(msg: string | undefined): void;
}

abstract class abstract_subject{
    subject_name:string;
    observers: abstract_observer[]= [];
    current_message:string | undefined;
    constructor(name:string){
        this.subject_name = name;
    }
    //提供订阅入口
    subscribe(observer:abstract_observer){
        this.observers.push(observer);
        console.log(observer.name+"成功订阅"+this.subject_name);
    }
    //提供取消订阅入口
    unsubscribe(observer:abstract_observer ){
        this.observers.splice(this.observers.indexOf(observer),1);
        console.log(observer.name+"成功取消订阅"+this.subject_name);
    }
    update_message(msg: string){
        this.current_message = msg;
    }
    //发布消息
    publish(){
        console.log("Server 开始发布消息");
        for (const observer of this.observers){
            console.log("发布消息给"+observer.name+"!");
            observer.handle_publish(this.current_message);
        }
        console.log("所有订阅"+this.subject_name+"的人已经收到消息！");
    }
}

//具体观察者
export class concrete_observer extends abstract_observer{
    constructor(name:string){
        super(name);
    }
    handle_publish(msg: string){
        this.message = msg;
        console.log(this.name+": 已经接到消息:"+this.message);
    }
}
//具体股票主题
export class concrete_subject_gupiao extends abstract_subject{
    override publish(){
        console.log('发送股票新消息');
        super.publish();
    }
    override update_message(updatemsg: string){
        console.log("股票消息更新:"+updatemsg);
        super.update_message(updatemsg);
    }
}
//具体NBA主题
export class concrete_subject_nba extends abstract_subject{
    override publish(){
        console.log('发送NBA新消息');
        super.publish();
    }
    override update_message(updatemsg: string){
        console.log("NBA消息更新："+updatemsg);
        super.update_message(updatemsg);
    }
}
