import * as stemlib from './stem.js';

export function apply(dict) {
    dict[stemlib.stem('Питер')]     = 'Saint Petersburg';
    dict[stemlib.stem('СПБ')]       = 'Saint Petersburg';
    dict[stemlib.stem('Ленинград')] = 'Saint Petersburg';
    dict[stemlib.stem('Петроград')] = 'Saint Petersburg';
    dict[stemlib.stem('ЕКБ')]       = 'Yekaterinburg';
    dict[stemlib.stem('Екат')]      = 'Yekaterinburg';
    dict['NY']          = 'New York';
    dict['LA']          = 'Los Angeles';
    dict['Александрии'] = 'Alexandria';
    dict['Александрии'] = 'Alexandria';
    dict['Борисов']     = 'Horad Barysaw';
    dict['Борисова']    = 'Horad Barysaw';
    dict['Московский']  = 'Moskovskiy';
    dict['Московского'] = 'Moskovskiy';
    [
        'александр', 'борис',   'московск', 'сама',
        'дава',      'майн',    'матар',    'Эта',
        'авас',      'диван',   'бред',     'спец',
        'ура',       'над',     'гей',      'зим',
        'Зима',      'чех',     'лук',      'мур',
        'южн',       'хорош',   'Хороший',  'ухт',
        'брав',      'брем',    'сер',      'паду',
        'лонг',      'корол',   'Вау',      'тысяч',
        'Тэгу',      'сюрприз', 'surprise', 'Surprise',
        'Сюрприз',   'Дай',     'армен',    'armenia',
        'Armenia',   'Армения',
    ].forEach(e => delete dict[e]);
}
