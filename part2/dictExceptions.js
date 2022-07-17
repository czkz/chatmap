import * as stemlib from './stem.js';

export function apply(dict) {
    dict[stemlib.stem('Питер')]       = 'Saint Petersburg';
    dict[stemlib.stem('СПБ')]         = 'Saint Petersburg';
    dict[stemlib.stem('Ленинград')]   = 'Saint Petersburg';
    dict[stemlib.stem('Петроград')]   = 'Saint Petersburg';
    dict[stemlib.stem('NY')]          = 'New York';
    dict[stemlib.stem('LA')]          = 'Los Angeles';
    dict['Борисов']     = 'Horad Barysaw';
    dict['Борисова']    = 'Horad Barysaw';
    dict['Александрии'] = 'Alexandria';
    delete dict['александр'];
    delete dict['борис'];
    delete dict['сама'];
    delete dict['дава'];
    delete dict['майн'];
    delete dict['матар'];
    delete dict['Эта'];
    delete dict['авас'];
    delete dict['диван'];
    delete dict['бред'];
    delete dict['спец'];
}