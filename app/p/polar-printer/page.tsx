import styles from './PolarPrinter.module.scss';
import Link from 'next/link';
import Markdown from '~/components/Markdown/Markdown';
export default function PolarPrinterPage() {
	return (
		<main className={styles.main}>
			<Link href="../../" className={styles.back}>
				{'<- '}GOBACK
			</Link>
			<Markdown>{`# Polar Printer
I have been working on building a 3D printer that houses all of the electronics underneath the build plate.
In 2024 I have started a complete redesign around a **linear rail**, a **90deg heater block** and an **igus bushing**. 

![](/polar-tiger-27-5-24.png)

This **cantilevered core-RZ** configuration using a single belt (inverted H-Bot) makes the machine capable of doing complex and fast **non planar print moves**.

The 30cm diameter **printbed rotates** and when detached, the entire printer is just 7cm wide.

![](/blueprint@5x.png)

The bowden tube runs through the frame and the hotend makes the filament take a 90deg turn. 

## Future 

A custom heatblock will reduced the hotend angle to 45deg to allow for printing 90deg overhangs.
The bed will be hot swappable with a linear bed, a belt for bigger prints and a combination of the rotary and linear axis to achieve get full 5 axis control.

    `}</Markdown>
			{/* <TODO /> */}
		</main>
	);
}

function TODO() {
	const items = [
		'Build klipper with polar-rz kinematics',
		'electronics enclosure',
		'power supply mount',
		'motor mount back plate',
		'extruder',
		'cold-end fan',
		'part cooling fan',
		'filament arm',
		'belt tensioner',
		'top idler',
		'extrusion endcaps',
		'power plug mount',
	];
	return (
		<div className={styles.todo}>
			<h2>TODO</h2>
			<ul>
				{items.map((item, i) => (
					<li key={i}>
						<label>
							<input type="checkbox" />
							<span>{item}</span>
						</label>
					</li>
				))}
			</ul>
		</div>
	);
}
