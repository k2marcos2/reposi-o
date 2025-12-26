document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("canvasPolicial");
    const inputHidden = document.getElementById("inputAssinaturaPolicial");
    const form = document.getElementById("formPolicial");
    const resultado = document.getElementById("resultado");
    const iframe = document.getElementById("retorno");
    const btn = form.querySelector(".btn-submit");

    const pad = new SignaturePad(canvas, { backgroundColor: 'rgb(255, 255, 255)', penColor: 'rgb(0, 0, 0)' });

    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
        pad.clear();
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    window.limparAssinatura = function() { pad.clear(); inputHidden.value = ""; };

    form.addEventListener("submit", function(e) {
        if (pad.isEmpty()) {
            e.preventDefault();
            alert("Assinatura obrigatória!");
            return;
        }
        btn.disabled = true;
        btn.innerText = "Enviando...";
        inputHidden.value = pad.toDataURL("image/png");
        resultado.style.display = "block";
        resultado.innerText = "Processando...";
        resultado.className = "resultado-box";
    });

    iframe.onload = function() {
        btn.disabled = false;
        btn.innerText = "FINALIZAR CAUTELA";
        try {
            const txt = iframe.contentDocument.body.innerText.trim();
            if (txt && !txt.includes("ERRO")) {
                resultado.innerHTML = `<h3>✅ Sucesso!</h3><div class="id-destaque">${txt}</div><p>Tire um print.</p>`;
                resultado.className = "resultado-box sucesso";
                pad.clear(); form.reset(); document.getElementById('dataHoje').valueAsDate = new Date();
            } else if (txt) {
                resultado.innerText = "❌ " + txt;
                resultado.className = "resultado-box erro";
            }
        } catch (e) {
            resultado.innerText = "⚠️ Enviado! Verifique a planilha.";
            resultado.className = "resultado-box sucesso";
        }
    };
});