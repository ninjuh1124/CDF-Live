import React, { useState, useEffect } from 'react';
import { map, list } from '../resources/facecodes';
import CommentFace from './CommentFace';
import Heading from './Heading';

const CommentFaces = props => {
	const sorts = {
		sets: [...new Set(list.map(face => face.set))],
		series: [...new Set(list.map(face => face.series))]
	}

	const [sort, changeSort] = useState('sets');
	const [tables, setTables] = useState([]);

	const generateRows = arr => {
		const maxWidth = 6;
		const rows = [];

		const buildRow = (pos = 0) => {
			let r = [];
			for (let i=0; i<maxWidth; i++) {
				if (i >= arr.length) break;
				r[i] = arr[pos+i];
			}

			return r;
		}

		for (let i=0; i<arr.length; i+=maxWidth) {
			rows[i/6] = buildRow(i);
		}

		return rows;
	}

	const generateTables = groups => {
		groups = groups.map(group => generateRows(group.faces))
		let table = [];

		const toCode = face => {
			if (face) return `#${face.name}`;
			else return null;
		};
		const toCell = code => {
			if (code) return (
				<td>
					<CommentFace key={code} code={code}>{code}</CommentFace>
				</td>
			);
			else return null;
		};
		const toRow = row => (
			<tr>
				row.map(face => toCode).map(code => toCell);
			</tr>
		);

		for (let i=0; i<groups.length; i++) {
			table[i] = (
				<table>{groups[i].map(row => toRow)}</table>
			)
		}

		return table;
	};

	useEffect(() => {
		const groups = sorts[sort].map(group => ({
			title: group,
			faces: list.filter(face => {
				if (sort === 'sets') return group === face.set;
				else if (sort === 'series') return group === face.series;
			})
		}));

		console.log(groups);
		setTables(generateTables(groups));
	}, [sort]);

	return (
		<>
			<Heading
				title='Comment Faces'
				prebar={() => (
					<h4>How to use:</h4>
					<p><code>[top text **bottom text**](#therethere "hover text")</code> will produce the following</p>
					<CommentFace title='hover text' code='#therethere'>
						top text <strong>bottom text</strong>
					</CommentFace>
				)}
			/>
			{tables}
		</>
	);
}

export default CommentFaces;
