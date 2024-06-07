document.getElementById('loadData').addEventListener('click', function() {
    fetch('100.dat')
        .then(response => response.arrayBuffer())
        .then(data => {
            const ecgData = new Uint8Array(data);
            const channel1 = [];
            const channel2 = [];

            for (let i = 0; i < ecgData.length; i += 3) {
                const sample1 = ((ecgData[i] & 0xFF) | ((ecgData[i + 1] & 0x0F) << 8)) - 2048;
                const sample2 = (((ecgData[i + 1] >> 4) & 0x0F) | ((ecgData[i + 2] & 0xFF) << 4)) - 2048;

                channel1.push(sample1);
                channel2.push(sample2);
            }

            drawECG(channel1, 'ecgCanvas');
        })
        .catch(error => console.error('Error fetching ECG data:', error));
});

function drawECG(data, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const offset =1000;
    const width = canvas.width;
    const height = canvas.height;
    const scaleX = 0.5; //width / data.length;
    const scaleY = 0.1; //height /   (Math.max(...data) - Math.min(...data));

    ctx.beginPath();

    const oy = (height / 2) - (data[ offset] * scaleY);
    ctx.moveTo(0, oy);

    //data.length
    for (let i =0 ; i <  2000; i++) {
        const x = i * scaleX;
        const y = (height / 2) - (data[i+ offset] * scaleY);
        ctx.lineTo(x, y);
    }

    ctx.stroke();
}
