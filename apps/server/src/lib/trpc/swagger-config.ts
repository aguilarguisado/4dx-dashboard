import { appRouter } from '../../common/data/router';

import { JsonObject } from 'swagger-ui-express';
import { generateOpenApiDocument } from 'trpc-openapi';
type GenerateSwaggerDocumentOptions = {
	url: string;
};

export const getSwaggerDocument: (option: GenerateSwaggerDocumentOptions) => JsonObject = ({ url }) => {
	const license = {
		name: 'MIT',
		url: 'SAMPLE URL',
	};
	const contact = {
		name: 'Juan Aguilar',
		url: 'SAMPLE URL',
		email: 'info@email.com',
	};

	const servers = [{ url }];

	const openApiDocument = generateOpenApiDocument(appRouter, {
		title: '4DX Dashboard API',
		version: '0.1.0',
		baseUrl: url,
		description:
			'This is the API for 4DX Dashboard. It is a RESTful API built with Node.js, Express, and TypeScript.',
	});

	openApiDocument.info.license = license;
	openApiDocument.info.contact = contact;
	openApiDocument.servers = servers;

	return openApiDocument;
};
