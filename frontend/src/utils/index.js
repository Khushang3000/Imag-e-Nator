//utility file is a file where we can create functions and then use them across our entire application.

import FileSaver from 'file-saver';
import { download } from "../assets/index.js";
import {surpriseMePrompts} from "../constants/index.js"

export function getRandomPrompt(prompt){
    const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
    const randomPrompt = surpriseMePrompts[randomIndex];

    if(randomPrompt === prompt) return getRandomPrompt(prompt);

    return randomPrompt;

}

export async function downloadImage(_id,photo){
    FileSaver.saveAs(photo, `download-${_id}.jpg`);
}