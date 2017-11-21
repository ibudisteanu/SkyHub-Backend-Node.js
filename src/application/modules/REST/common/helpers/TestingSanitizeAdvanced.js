import SanitizeAdvanced from 'REST/common/helpers/SanitizeAdvanced'

class TestingSanitizeAdvanced{

    _test1(){

        let sDescription = "<div class=\"text\">\n" +
            "\t<p>Mircea Badea a vorbit în emisiunea „În gura presei”, de la Antena 3, despre dezvăluirile pe care le-a făcut judecătoarea Evelina Oprina, în emisiunea „Sinteza zilei”.</p>\n" +
            "\n" +
            "<div id=\"ivm-inread\" data-zone=\"Antena3-Video-OutStream\"></div><p>„La „Sinteza zilei” a venit o doamnă judecător de la  Consiliul Superior al Magistraturii. Doamna judecător se numește Evelina Oprina și a vorbit despre cum s-a răzgândit, într-o noapte, CSM cu privire la votul dat pe legile justiției ale lui Tudorel Toader. <br>\n" +
            "Și doamna judecător a spus să seara au plecat toți înțeleși în unanimitate și dimineața s-au răzgândit mai mulți.</p>\n" +
            "\n" +
            "<!-- AdUnity AdTag :BEGIN-->    \n" +
            "\t<script type=\"text/javascript\" src=\"//content.adunity.com/sync.js\"></script>\n" +
            "\t<script type=\"text/javascript\">\n" +
            "\t\t\t\t\tif (window.AUSync) window.AUSync.ShowAd({ \n" +
            "\t\t\t\t\t\t\t\t\t\"accountID\": \"730763006483459\",\n" +
            "\t\t\t\t\t\t\t\t\t\"siteID\": \"antena3.ro\", \n" +
            "\t\t\t\t\t\t\t\t\t\"zoneID\": \"out-stream-video\"\n" +
            "\t\t\t\t\t});\n" +
            "\t</script>\n" +
            "\t<!-- AdUnity AdTag :END-->\n" +
            "\t<script src=\"https://cdn.stickyadstv.com/prime-time/intext-roll.min.js?zone=896793&amp;smartPlay=true\" type=\"text/javascript\"></script><p>Așa cum am mai remarcat, cei mai puțintei la minte din această țară, și nu sunt foarte mulți, dar sunt foarte agresivi, nu vor să afle despre asta, dintr-un motiv foarte simplu, că nu e despre Dragnea. Puținteii la minte din această țară judecă orice în această țară, în funcție de Dragnea. Ei sunt obsedați de Dragnea, cum au fost pe vremuri obsedați de Ponta. Ei atât pot, de aceea sunt puțintei la minte. Ei nu pot avea o diversitate de gânduri, de percepții, de interacțiuni. (...) Orice nu este cu Dragnea, nu ajunge la ei. Pentru ei vaiața e simplă, dacă e rău pentru Dragnea, e bine, dacă e bine pentru Dragnea, e rău”, spune Mircea Badea.</p>\n" +
            "\n" +
            "<p class=\"title_video\"><script type=\"text/javascript\" src=\"https://ivm.antenaplay.ro/js/embed.js?id=kWjRqWemw1P&amp;width=620&amp;height=349&amp;autoplay=0&amp;wide=true\"></script></p>\n" +
            "        \n" +
            "         \n" +
            "        </div>"

        for (let i=0; i<50; i++)
            console.log("#### sanitized")

        let sanitized = SanitizeAdvanced.sanitizeAdvanced(sDescription);
        console.log(sanitized);
    }

}

export default new TestingSanitizeAdvanced();