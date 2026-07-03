<template>
    <div v-show="show" class="loading" :class="{start,end}">
        <div class="cube" :class="{start,end}">
            <div class="axis-switcher">
                <div class="cube__comp">
                    <div class="cube__face"/>
                    <div class="cube__face"/>
                    <div class="cube__face"/>
                    <div class="cube__face"/>
                    <div class="cube__face"/>
                </div>
                <div class="cube__comp">
                    <div class="cube__face"/>
                    <div class="cube__face"/>
                    <div class="cube__face"/>
                    <div class="cube__face"/>
                    <div class="cube__face"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const start = ref(false)
const end = ref(false)
const show = ref(false)

const loader = useLoader()
watch(() => loader.loading, (nValue) => {
    if(nValue) {
        show.value=true
        start.value=true
    }else{
        end.value=true
    }
})

watch([start], (val)=>{
    if(val){
        show.value=true
        setTimeout(()=>{
            start.value=false
        }, 1100)
    }
})
watch([end], (val)=>{
    if(val){
        setTimeout(()=>{
            end.value=false
            show.value=false
        }, 1100)
    }
})
</script>

<style lang="scss" scoped>
@use "sass:math";

.loading {
    position: fixed;
    z-index: 10000;
    background: rgb(var(--v-theme-surface));
    width: 100vw;
    height: 100vh;
}

.loading.start{
    animation: fade 1s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

.loading.end{
    animation: fade 1s reverse forwards cubic-bezier(0.68, -0.6, 0.32, 1.6);
}


@keyframes fade {
    from{
        opacity: 0;
    }
    to{
        opacity: 1;
    }
}

$c: #D72323;
$cube-edge: 27vh;
$n-strips: 3;
$strip-size: math.div($cube-edge, $n-strips);
$gap: .125*$strip-size;
$tile-size: $strip-size - $gap;
$normal-offset: .5*($gap - $cube-edge);
$t: 1s;
$m: 6;

@mixin tile($off: 0, $jump: 2) {
	$sh: (); // init shadow list
	$n: math.ceil(math.div($n-strips - $off, $jump));
	
	@for $i from 0 to $n-strips {
		@for $j from 0 to $n {
			$sh: $sh, $i*$strip-size 
				$j*$jump*$strip-size currentColor;
		}
	}
	
	top: $normal-offset + $off*$strip-size;
	box-shadow: $sh;
}

.axis-switcher {
	animation: switch $m*$t steps(1) infinite;
}

@keyframes switch {
	@for $i from 1 to $m {
		$j: $i%2;
		$k: math.floor(math.div($i, 2));

		#{math.div($i*100%, $m)} {
			transform: if(sass($k < 1): (); else: rotate3d(1 - $j, 0, $j, 90deg))
				if(sass($k%2 < 1): rotate(.5turn); else: ());
		}
	}
}

@keyframes start {
    from {
        scale: 0;
    }
    to {
        scale: 1;
    }
}

.cube.start{
    animation: start 1s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

.cube.end{
    animation: start 1s reverse forwards cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

.cube,
.cube * {
	position: absolute;
	transform-style: preserve-3d;
    left: 50%;
    top: 50%;
}

.cube {
	transform: rotateX(-35deg) rotateY(45deg);
	color: #F56217;
	
	&__comp {
		&:first-child {
			* {
				transform: rotateX(-90deg) translateZ(.5*$cube-edge);
			}
			:before { @include tile(1, 1); }
		}
		
		&:last-child {
			animation: r $t cubic-bezier(.68, -.55, .265, 1.55) infinite;
		}
	}
	
	&__face {
		backface-visibility: hidden;
		transform: rotateX(90deg) translateZ(.5*$cube-edge);
		
		&:before {
			position: absolute;
			left: $normal-offset;
			width: $tile-size;
			height: $tile-size;
			border-radius: 4px;
			@include tile(0, 3);
			background: currentColor;
			content: '';
		}
		
		@for $i from 0 to 4 {
			&:nth-child(#{$i + 1}) {
				transform: rotateY($i*90deg) 
					translateZ(.5*$cube-edge);
			}
		}
		
		&:last-child:before {
			@include tile(0, 1);
		}
	}
}

@keyframes r {
	to { transform: rotateY(-90deg); }
}
</style>