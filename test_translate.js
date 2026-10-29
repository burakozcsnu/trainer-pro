const { translate } = require('@vitalets/google-translate-api');

async function testTranslate() {
    try {
        const res = await translate('Beef, chuck, short ribs, separable lean only, trimmed to 0" fat', { to: 'tr' });
        console.log(res.text);
    } catch (e) {
        console.error(e);
    }
}
testTranslate();