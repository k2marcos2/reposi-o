// Aguarda o DOM carregar para não dar erro de elemento null
document.addEventListener("DOMContentLoaded", function() {

    const canvas = document.getElementById("assinaturaArmeiro");
    const inputHidden = document.getElementById("assinatura_armeiro");
    const form = document.getElementById("formArmeiro");
    const resultado = document.getElementById("resultado");
    const iframe = document.getElementById("retorno");

    // Inicializa o SignaturePad
    const pad = new SignaturePad(canvas, {
        backgroundColor: 'rgba(255, 255, 255, 1)', // Fundo branco forçado
        penColor: 'rgb(0, 0, 0)'
    });

    // --- CORREÇÃO CRÍTICA: Redimensionar o Canvas ---
    // Sem isso, a assinatura sai borrada ou em branco
    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
        pad.clear(); // Limpa ao redimensionar
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Chama imediatamente ao carregar

    // Botão Limpar (se você adicionar no HTML)
    window.limparAssinatura = function() {
        pad.clear();
        inputHidden.value = "";
    };

    // Evento de Envio
    form.addEventListener("submit", function(e) {
        if (pad.isEmpty()) {
            e.preventDefault();
            alert("ERRO: O Armeiro precisa assinar para confirmar.");
            return;
        }

        // Joga a imagem no input hidden ANTES de enviar
        const dadosImagem = pad.toDataURL("image/png");
        inputHidden.value = dadosImagem;

        resultado.innerText = "Enviando dados... aguarde.";
        resultado.style.color = "blue";
    });

    // Escuta o retorno do Iframe
    iframe.onload = function() {
        try {
            // ATENÇÃO: Se rodar localmente, isso pode dar erro de bloqueio (CORS).
            // Se der erro, o catch captura.
            const txt = iframe.contentDocument.body.innerText.trim();
            if (txt) {
                if (txt.includes("ERRO")) {
                    resultado.innerHTML = "❌ " + txt;
                    resultado.style.color = "red";
                } else {
                    resultado.innerHTML = "✅ " + txt;
                    resultado.style.color = "green";
                    pad.clear();
                    form.reset();
                    // Reinicia a data para hoje
                    document.querySelector('input[type="date"]').valueAsDate = new Date();
                }
            }
        } catch (err) {
            // Se der erro de segurança (Cross-Origin), assumimos que enviou
            console.log("Bloqueio de leitura do iframe (CORS):", err);
            resultado.innerHTML = "⚠️ Dados enviados! Verifique a planilha.";
            resultado.style.color = "orange";
        }
    };
});