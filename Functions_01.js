//1. 矩形水波纹效果
var timer1=null;   //保证波形的运动效果
var timer2=null;
var timer3=null;
var timer4=null;

drawWave('c1',50,110,68,1000,1,'60%');  //调用函数展示效果
drawWave('c2',50,110,68,1000,2,'60%');


function drawWave(ctx,width,height,waveHeight,autoDiff,whichWave,texts){  //autoDiff 固定1000

    var ctx=document.getElementById(ctx).getContext('2d');
    var interT=autoDiff;

    function Vertex(x,y,baseY){
        this.baseY = baseY;         //基线
        this.x = x;                 //点的坐标
        this.y = y;
        this.vy = 0;                //竖直方向的速度
        this.targetY = 0;           //目标位置
        this.friction = 0.03;       //摩擦力   //控制波浪波动幅度
        this.deceleration = 0.8;   //减速  //控制波浪波动幅度
    }
//y坐标更新
    Vertex.prototype.updateY = function(diffVal){
        this.targetY = diffVal + this.baseY;   //改变目标位置
        this.vy += (this.targetY - this.y);       //速度
        this.vy *= this.deceleration;
        this.y += this.vy * this.friction;     //改变坐标竖直方向的位置
    }

    ctx.clearRect(0,0,width,height);  //清除整个画布

    var W = width;
    var H = height;
    var waveH=height-waveHeight;//控制波浪高度

    var color1 = "#6ca0f6";    //矩形1的颜色
    var color2 = "#367aec";   //矩形2的颜色

    var vertexes = [];    //顶点坐标
    var verNum = 250;    //顶点数
    var diffPt = [];    //差分值

    for(var i=0; i<verNum; i++){
        vertexes[i] = new Vertex(W/(verNum-1)*i, waveH,waveH);  //每个点的Y坐标是H/2 dao
        diffPt[i] = 0;                                         //初始值都为0
    }

    function draw() {
        //矩形1
        ctx.save()
        ctx.fillStyle=color1;
        ctx.beginPath();
        ctx.moveTo(0, H);
        ctx.lineTo(vertexes[0].x, vertexes[0].y);
        for(var i=1; i<vertexes.length; i++){
            ctx.lineTo(vertexes[i].x, vertexes[i].y);
        }
        ctx.lineTo(W,H);
        ctx.lineTo(0,H);
        ctx.fill();
        ctx.restore();

        //矩形2
        ctx.save();
        ctx.fillStyle=color2;
        ctx.beginPath();
        ctx.moveTo(0, H);
        ctx.lineTo(vertexes[0].x, vertexes[0].y+5);
        for(var i=1; i<vertexes.length; i++){
            ctx.lineTo(vertexes[i].x, vertexes[i].y+5);
        }
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.fill();
        ctx.restore();
        //氧气百分百 文字
        var remainP=parseInt(texts);
        ctx.font="14px sans-serif";
        if(remainP<=20){
            ctx.fillStyle ='#367AEC';
            ctx.fillText(texts,15,waveH-5);
        }else{
            ctx.fillStyle ='#fff';
            ctx.fillText(texts,15,waveH+20);
        }

    }

    //2.核心代码
    var vPos = 1;  //震荡点
    var dd = 15;     //缓冲

    function update(){

        autoDiff -= autoDiff*0.9;        //1

        diffPt[vPos] = autoDiff;

        //左侧
        for(var i=vPos-1; i>0; i--){     //2
            var d = vPos-i;
            if(d > dd){
                d=dd;
            }
            diffPt[i]-=(diffPt[i] - diffPt[i+1])*(1-0.01*d);
        }
        //右侧
        for(var i=vPos+1; i<verNum; i++){   //3
            var d = i-vPos;
            if(d>dd){
                d=dd;
            }
            diffPt[i] -= (diffPt[i] - diffPt[i-1])*(1-0.01*d);
        }

        //更新Y坐标
        for(var i=0; i<vertexes.length; i++){  //4
            vertexes[i].updateY(diffPt[i]);
        }

    }

    if(whichWave==1){    //whichWave 用于判断是那个波纹 进而调用不同定时器 现暂时有两个波纹
        clearInterval(timer1);
        timer1=null;
        timer1=setInterval(function(){   //调用波纹的函数（因为autoDiff差分需要每次递减（update函数中实现）来实现波浪效果，所以需要使用定时器来完成）

            ctx.clearRect(0, 0, W, H);
            update();
            draw();
        },16)

        clearInterval(timer2);
        timer2=null;

        timer2=setInterval(function () {  //设置定时器保证autoDiff持续更新，使波浪连续不停
            autoDiff=interT;

        },500)   //每次设置
    }

    if(whichWave==2){
        clearInterval(timer3);
        timer3=null;
        timer3=setInterval(function(){   //调用波纹的函数（因为autoDiff差分需要每次递减（update函数中实现）来实现波浪效果，所以需要使用定时器来完成）
            ctx.clearRect(0, 0, W, H);
            update();
            draw();
        },16)

        clearInterval(timer4);
        timer4=null;

        timer4=setInterval(function () {  //设置定时器保证autoDiff持续更新，使波浪连续不停

            autoDiff=interT;

        },500)   //每次设置
    }

}
//2. 根据油量多少进行可视化展示

drawRate('cc1',70,'#f8bdbf','#f2a4a9','#f47b81','#ff4c51','#ff1f23','#ff0000'); //绘制油量和水温
drawRate('cc2',65,'#fdfacc','#faf4ab','#fff682','#fdf461','#f9ee37','#ffca00');

function darwBlocks2(num,ctx,x1,y1,x2,y2,x3,y3,x4,y4){
    for(var i=num;i<6;i++){
        ctx.beginPath();
        ctx.moveTo(x1+19*i,y1);
        ctx.lineTo(x2+19*i,y2);
        ctx.lineTo(x3+19*i,y3);
        ctx.lineTo(x4+19*i,y4);
        ctx.fillStyle='#ffffff';
        ctx.fill();
    }
}

function drawBlocks1(ctx,i,color,x1,y1,x2,y2,x3,y3,x4,y4){
    ctx.beginPath();
    ctx.moveTo(x1+19*i,y1);
    ctx.lineTo(x2+19*i,y2);
    ctx.lineTo(x3+19*i,y3);
    ctx.lineTo(x4+19*i,y4);
    ctx.fillStyle=color;
    ctx.fill();
}

function drawRate(cc,rate,color1,color2,color3,color4,color5,color6){   //

    var canvas=document.getElementById(cc);
    var ctx=canvas.getContext('2d');
    var x1=0,y1=0;
    var x2=17,y2=0;
    var x3=20,y3=5;
    var x4=3,y4=5;

    ctx.save();

    if(rate<3){

        darwBlocks2(0,ctx,x1,y1,x2,y2,x3,y3,x4,y4);
    }else if(rate<=16.6){
        drawBlocks1(ctx,0,color1,x1,y1,x2,y2,x3,y3,x4,y4);
        darwBlocks2(1,ctx,x1,y1,x2,y2,x3,y3,x4,y4);
    }else if(rate<=33.2){
        drawBlocks1(ctx,0,color1,x1,y1,x2,y2,x3,y3,x4,y4);
        drawBlocks1(ctx,1,color2,x1,y1,x2,y2,x3,y3,x4,y4);
        darwBlocks2(2,ctx,x1,y1,x2,y2,x3,y3,x4,y4);
    }else if(rate<=49.8){
        drawBlocks1(ctx,0,color1,x1,y1,x2,y2,x3,y3,x4,y4);
        drawBlocks1(ctx,1,color2,x1,y1,x2,y2,x3,y3,x4,y4);
        drawBlocks1(ctx,2,color3,x1,y1,x2,y2,x3,y3,x4,y4);
        darwBlocks2(3,ctx,x1,y1,x2,y2,x3,y3,x4,y4);
    }else if(rate<=66.4){
        drawBlocks1(ctx,0,color1,x1,y1,x2,y2,x3,y3,x4,y4);
        drawBlocks1(ctx,1,color2,x1,y1,x2,y2,x3,y3,x4,y4);
        drawBlocks1(ctx,2,color3,x1,y1,x2,y2,x3,y3,x4,y4);
        drawBlocks1(ctx,3,color4,x1,y1,x2,y2,x3,y3,x4,y4);
        darwBlocks2(4,ctx,x1,y1,x2,y2,x3,y3,x4,y4);
    }else if(rate<=83){
        drawBlocks1(ctx,0,color1,x1,y1,x2,y2,x3,y3,x4,y4);
        drawBlocks1(ctx,1,color2,x1,y1,x2,y2,x3,y3,x4,y4);
        drawBlocks1(ctx,2,color3,x1,y1,x2,y2,x3,y3,x4,y4);
        drawBlocks1(ctx,3,color4,x1,y1,x2,y2,x3,y3,x4,y4);
        drawBlocks1(ctx,4,color5,x1,y1,x2,y2,x3,y3,x4,y4);
        darwBlocks2(5,ctx,x1,y1,x2,y2,x3,y3,x4,y4);
    }else{
        drawBlocks1(ctx,0,color1,x1,y1,x2,y2,x3,y3,x4,y4);
        drawBlocks1(ctx,1,color2,x1,y1,x2,y2,x3,y3,x4,y4);
        drawBlocks1(ctx,2,color3,x1,y1,x2,y2,x3,y3,x4,y4);
        drawBlocks1(ctx,3,color4,x1,y1,x2,y2,x3,y3,x4,y4);
        drawBlocks1(ctx,4,color5,x1,y1,x2,y2,x3,y3,x4,y4);
        drawBlocks1(ctx,5,color6,x1,y1,x2,y2,x3,y3,x4,y4);
        console.log("测试");
    }

    ctx.restore();
}

//3. 心电，呼吸，血氧 等动态波形图 函数
var timer5=null;    //动态调用波形，使其呈现动效
var LX1=0;          //记录每一阶段（每秒）末尾时的坐标（x,y），避免断点，可根据
var LY1=0;
var waveCheck=0;    //保证 “首尾相接” 在一块画布中进行绘制

/*
timer5=setInterval(function () {
    //(1) 由于没有连接设备无具体数据所以自己早一个 假数据
    var waveArray=[15,16,20,20,20,20,20,20,25,30,30,31,32,32,33,31,33,35,30,29,28,28,29,28,27];
    waveArray=waveArray.concat(waveArray);
    waveArray=waveArray.concat([60,70,80,80,80,60,50,40,-20,-30,0,10,12,13,14,15,12,13,14,16,15,16,17,15,15]);
    waveArray=waveArray.concat([15,16,20,20,20,20,20,20,25,30,30,31,32,32,33,31,33,35,30,29,28,28,29,28,27]);
    //console.log(waveArray);
    //(2) 调用函数
   // waveTimer(3,waveArray,400,100,100);
},1000)
*/



