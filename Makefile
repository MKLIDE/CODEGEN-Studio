.PHONY: help build test clean package dev download-models setup doctor lint format security-check docker

help:
    @echo "CodeGen Vision 1 Build System"
    @echo ""
    @echo "Commands:"
    @echo "  make dev          - Start development servers"
    @echo "  make build        - Build all components"
    @echo "  make test         - Run all tests"
    @echo "  make test-unit    - Run unit tests only"
    @echo "  make test-e2e     - Run end-to-end tests"
    @echo "  make clean        - Clean build artifacts"
    @echo "  make package      - Package for distribution"
    @echo "  make download-models - Download AI models"
    @echo "  make setup        - Setup development environment"
    @echo "  make doctor       - Check system requirements"
    @echo "  make run          - Run the application"
    @echo "  make lint         - Run linters"
    @echo "  make format       - Format code"
    @echo "  make security-check - Run security checks"
    @echo "  make docker-build - Build Docker image"
    @echo "  make docker-run   - Run in Docker"

dev:
    npm run dev

build:
    npm run build

test:
    npm run test

test-unit:
    npm run test:frontend & npm run test:rust & npm run test:java

test-e2e:
    npm run test:e2e

clean:
    npm run clean

package:
    npm run package

download-models:
    npm run download-models

setup:
    npm run setup

doctor:
    npm run doctor

run:
    cd src-tauri && cargo tauri dev

lint:
    npm run lint

format:
    npm run format

security-check:
    npm run security-check

docker-build:
    npm run docker:build

docker-run:
    npm run docker:run

coverage:
    npm run coverage

storybook:
    npm run storybook

# Development shortcuts
f = format
t = test
b = build
d = dev
c = clean
l = lint
s = setup
