document.getElementById('startBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('audioInput');
    const token = document.getElementById('hfToken').value;
    const modelId = document.getElementById('hfModelId').value;
    const btn = document.getElementById('startBtn');
    const songList = document.getElementById('songList');

    if (!fileInput.files[0] || !token) {
        alert("Lütfen bir ses dosyası yükleyin ve API Token girin!");
        return;
    }

    btn.innerText = "LIQUID LFM İŞLİYOR...";
    btn.disabled = true;

    try {
        const audioData = await fileInput.files[0].arrayBuffer();

        const response = await fetch(
            `https://api-inference.huggingface.co/models/${modelId}`,
            {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/octet-stream"
                },
                method: "POST",
                body: audioData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "API Hatası oluştu.");
        }

        const contentType = response.headers.get("Content-Type");
        const item = document.createElement('div');
        item.className = 'song-item';

        // Eğer model ses dosyası döndürürse
        if (contentType && contentType.includes("audio")) {
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            item.innerHTML = `
                <span>Liquid Ses Çıktısı - ${new Date().toLocaleTimeString()}</span>
                <audio controls src="${audioUrl}" style="height:32px;"></audio>
            `;
        } 
        // Eğer model analiz/metin döndürürse
        else {
            const result = await response.json();
            item.innerHTML = `
                <span>Analiz: ${JSON.stringify(result).substring(0, 50)}...</span>
                <button class="play-btn" style="background:#00ffcc; color:#000; border:none; border-radius:4px; padding:5px 10px; cursor:pointer;">KOPYALA</button>
            `;
        }
        
        songList.prepend(item);

    } catch (error) {
        alert("Hata: " + error.message);
        console.error(error);
    } finally {
        btn.innerText = "BULUTTA İŞLE";
        btn.disabled = false;
    }
});
