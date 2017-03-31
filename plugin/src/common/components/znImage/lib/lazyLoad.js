import React from 'react';
import { findDOMNode } from 'react-dom';
import addEventListener from 'add-dom-event-listener';

let images = [];
let eventObj = null;
let count = 0;

export const register = (Component, callback) => {
	count++;

	const index = images.length;
	const element = {
		component: Component,
		callback
	};
	images.push(element);

	if (inViewport(element)) {
		removeImages(index);
	} else {
		initScrollEvent();
	}

	return function() {
		return removeImages(index);
	}
};

// remove image when image is in view port
const removeImages = (index) => {
	if (images[index] && images[index].callback) {
		images[index].callback.apply(null);

		images[index] = null;
		count--;
	}

	if (!count && eventObj) {
		eventObj.remove();
		images = [];
	}
};

// regist scroll event
const initScrollEvent = () => {
	if (!eventObj) {

		eventObj = addEventListener(document, "scroll", function(e, scrollHeight) {
			const copyImages = [...images];

			copyImages.map((image, index) => {
				if (image && inViewport(image, scrollHeight)) {
					removeImages(index);
				}
			});
		});
	}
}

// for scroll
// check image whether in the viewport
const inViewport = (image, scrollTop = window.scrollY) => {
	const screenHeight = window.innerHeight;

	const elem = findDOMNode(image.component);
	const offsetTop = elem.offsetTop;

	const gap = offsetTop - screenHeight - scrollTop;
	if (gap < 20) {		
		return true;
	}

	return false
};