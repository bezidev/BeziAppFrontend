<style>
    .b {
        font-weight: bold;
    }
</style>

<h1>Uradna pravila BežiTarok modula</h1>
Pravila določi vsak razred oz. tekmovalna skupina zase. Klicanje in štetje razlike ni moj problem, to določate sami, priporočam pa da igrate po pravilih
tekmovalnega strežnika <a href="https://valat.si/pravila">valat.si</a>.
<br>
Ta pravila so spisana predvsem zato, da predstavim kako modul šteje točke.
<p/>

<h2>Igre</h2>
<table style="border-collapse: separate; border-spacing: 5px 0; margin: 0 -5px; width: 100%;">
    <tbody>
        <tr>
            <th>Igra</th>
            <th>Vrednost v 4</th>
            <th>Vrednost v 3</th>
        </tr>
        <tr>
            <td>Klop</td>
            <td>Odvisno od rezultata</td>
            <td>Odvisno od rezultata</td>
        </tr>
        <tr>
            <td>Tri oz. Solo tri (v 3)</td>
            <td>10 + razlika</td>
            <td>10 + razlika</td>
        </tr>
        <tr>
            <td>Dve oz. Solo dve (v 3)</td>
            <td>20 + razlika</td>
            <td>20 + razlika</td>
        </tr>
        <tr>
            <td>Ena oz. Solo ena (v 3)</td>
            <td>30 + razlika</td>
            <td>30 + razlika</td>
        </tr>
        <tr>
            <td>Pikolo</td>
            <td>35 + razlika</td>
            <td class="b">SE NE KLIČE V 3 [pogojno se tudi lahko]</td>
        </tr>
        <tr>
            <td>Solo tri</td>
            <td>40 + razlika</td>
            <td class="b">SE NE KLIČE V 3</td>
        </tr>
        <tr>
            <td>Solo dve</td>
            <td>50 + razlika</td>
            <td class="b">SE NE KLIČE V 3</td>
        </tr>
        <tr>
            <td>Solo ena</td>
            <td>60 + razlika</td>
            <td class="b">SE NE KLIČE V 3</td>
        </tr>
        <tr>
            <td>Berač</td>
            <td>70</td>
            <td>70</td>
        </tr>
        <tr>
            <td>Solo brez</td>
            <td>80</td>
            <td>80</td>
        </tr>
        <tr>
            <td>Odprti berač</td>
            <td>90</td>
            <td class="b">SE NE KLIČE V 3 [pogojno se tudi lahko]</td>
        </tr>
        <tr>
            <td>Barvni valat</td>
            <td>125</td>
            <td class="b">SE NE KLIČE V 3 [pogojno se tudi lahko]</td>
        </tr>
        <tr>
            <td>Valat</td>
            <td>500</td>
            <td>500</td>
        </tr>
        <tr>
            <td>Renons</td>
            <td>-70</td>
            <td>-70</td>
        </tr>
    </tbody>
</table>
<p/>

<h2>Napovedi</h2>
<table style="border-collapse: separate; border-spacing: 5px 0; margin: 0 -5px; width: 100%;">
    <tbody>
    <tr>
        <th>Napoved</th>
        <th>Tiha (nenapovedana)</th>
        <th>Igrana (napovedana)</th>
    </tr>
    <tr>
        <td>Pagat ultimo</td>
        <td>25</td>
        <td>50</td>
    </tr>
    <tr>
        <td>Kralj ultimo</td>
        <td>10</td>
        <td>20</td>
    </tr>
    <tr>
        <td>Trula</td>
        <td>10</td>
        <td>20</td>
    </tr>
    <tr>
        <td>Kralji</td>
        <td>10</td>
        <td>20</td>
    </tr>
    </tbody>
</table>

<h2>Kazni</h2>
<h3>Neporabljeni radlci</h3>
Kazen za neporabljene radlce je -40 točk na radlc.

<h3>Izguba monda</h3>
Kdor izgubi monda, piše -21 točk. Na te točke se NE štejejo radlci.

<h2>Vpis razlike</h2>
<h3>Tri -> Solo ena</h3>
Pri teh igrah se vpiše normalno - če je igralec igral z negativno razliko (npr. -3), se vpiše negativno celo število (-3, <b>vključno z minusom</b>).
Če je igralec igral s pozitivno razliko ali ničlo (npr. 3), se vpiše naravno število ali ničla (3, <b>brez minusa</b>).

<h3>Klop</h3>
Pri klopu se vpiše razlika vsakega igralca. Razlika je lahko katerokoli celo število, sistem bo to pretvoril v pripadajoče negativno število.
V primeru, da igralec ni pobral ničesar, se mu vpiše 0, sistem pa mu potemtakem prizna pripadajočih +70 točk.
V primeru, da je igralec pobral več ali enako kot 35 točk, v sistem lahko vpišete pripadajoče točke igralcu,
s tem da vsem ostalim pripišete samo naključno število, manjše od 35 in večje od -35.
Sistem v tem primeru ne bo upošteval razlike drugih igralcev, ter jim bo pisal +0.
Igralcu, ki pobere več ali enako kot 35 točk, se piše -70.

