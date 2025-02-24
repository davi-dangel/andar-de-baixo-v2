import { Injectable } from "@angular/core";
import * as jsonData from '../../assets/articles.db.json';
import { HeadLine } from "../models/headline.model";

@Injectable({
    providedIn: 'root'
})
export class DataService{
    //TODO: ADD TYPES
    GetAll(): HeadLine[]{
        return JSON.parse(JSON.stringify(jsonData))["default"];
    }

    Get(id: number){
        const data = JSON.parse(JSON.stringify(jsonData))["default"];
        return data.find((item: any) => item.id == id);
    }
}