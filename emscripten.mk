CC      := emcc
CFLAGS  := -W -Wall -Wextra -Wno-unknown-pragmas -O3 -std=c99 -I.
LFLAGS	:= -lm

# Emscripten stuff
CFLAGS += --llvm-lto 3 -s INVOKE_RUN=0 -s NO_EXIT_RUNTIME=1 -s ASSERTIONS=0

# You may want to try with closure 1
asmjs:	CFLAGS += --closure 0 -s WASM=0
wasm: 	CFLAGS += --closure 0 -s WASM=1

CSOURCES := $(wildcard *.c) $(wildcard libs/*.c)

OBJS = $(patsubst %.c, %.bc, $(CSOURCES))

OUTPUT := convpng_web

asmjs:  $(OUTPUT).js
wasm:   $(OUTPUT).js

all: asmjs

%.bc: %.c
	$(CC) $(CFLAGS) $< -o $@

$(OUTPUT).js: $(OBJS)
	$(CC) $(CFLAGS) $(LFLAGS) $^ -o $@

clean:
	$(RM) -f $(OBJS) $(OUTPUT).js* $(OUTPUT).data $(OUTPUT).asm.js $(OUTPUT).was*

.PHONY: all clean asmjs wasm
