import '../../../styles/lucent.css';
import { boot } from '../common';
import { markup } from './markup';

const { scenario, rendered } = boot();
const html = markup[scenario.id];
if (html === undefined) throw new Error(`No reference markup for ${scenario.id}`);
document.getElementById('stage')!.innerHTML = html;
rendered();
