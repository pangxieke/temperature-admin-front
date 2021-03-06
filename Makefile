IMAGE=temperature-admin
TAG=$(shell git describe --always --tags)
REGISTRY=registry.cn-shenzhen.aliyuncs.com/***

all:
	docker build -t ${REGISTRY}/${IMAGE}:${TAG} .

push: all
	docker push ${REGISTRY}/${IMAGE}:${TAG}

publish: push
	docker tag ${REGISTRY}/${IMAGE}:${TAG} ${REGISTRY}/${IMAGE}:latest
	docker push ${REGISTRY}/${IMAGE}:latest
