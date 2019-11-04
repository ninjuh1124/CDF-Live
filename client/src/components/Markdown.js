import React from 'react';
import ReactMarkdown from 'react-markdown';
import renderers from '../resources/renderers';

export default props => (
	<ReactMarkdown
		source={props.source.replace(/^#{1,}/gm, '$& ')}
		disallowedTypes={['imageReference', 'linkReference']}
		unwrapDisallowed={true}
		plugins={[require('../resources/supPlugin')]}
		parserOptions={{ commonmark: true, pedantic: true }}
		renderers={renderers}
	/>
);
