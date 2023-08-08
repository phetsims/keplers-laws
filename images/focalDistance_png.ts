/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG8AAABXCAYAAAAK7BugAAAACXBIWXMAAAsSAAALEgHS3X78AAAI8klEQVR4nO2dW2wUVRjH/9OCBmy6Cw8C4dICTyKBquHBVmX7gkBEC5pwUZI+CAGDAZImvmiyaNAETKiXhBgfaIREjNFAJGpqYlqNPGgii6IQDVJihEAMtsulQEKP+U/3a6YtOzszO7ezO//NpLfdzpzzO993vnPmO2cMpRQMw8ggkW7KCTyVoNNOrTXVXgM6K4GnsSZUQiHSSKMJTY7f34OeQK8nLGkFL4OMCakRjSNfG9Bg/q0XvePe35htRF+2b9TvCHoxFpvfn8RJ9KPfhNlXeOkENrYBCys5Y3mxwlnZOeQglcyK58/FVChb0b+zAch5pDHwPGwI/L9HcCTOMFvNArKccTga0ah2YIfKIacUlOpBj8oiqzLIeLo+NVw4V0caadWGNtWJzpHrOIIjqh3t5t/iUlemI4oaHiuEFUNQ/ehXXegyK8+PivICb+zBBsXrI0AByeuranisFLZuAiO4IFq2H/DGXjM9Qx/6zINeIUJrDB8eK4DWxVbMr/w5qHP5Dc960JWLt4gIYnjwBJoUNkhoYcArVq4QIYYDj4WS/iwMaGHCk6MJTSOWyC5Ae3h0LewbWCgWLqyKjAKeHAxmpMwBN9Tg4Ekwwg4+7AqMEh4KEXQI5fcfHlsbx0c8wnSRcYInh3geDi8C6Av9hceLZWtjq4uy0uICDwUrpAtlY/a56/APHjvpEDtrbeDJIW7UR4D+wJNoMoqgRBd48L+Blw9PxjhxAxdHeAKQExQ+ACwPHiOpuIKLKzwrwDLnSL3DExcQV3BxhudT/XmDx6iSLSfO4OIODxbP5XEY4R4eTxS3qFJXeCjEDBxGhAKPYxaeMO6Vogs8GgPhMWIPFJ7cy4rZHWWt4aEwqc1uyGXGgHN4nOqiu/SakpDAsz9oeS7dp3N4dJW6uEsd4fGgV3Mxke0MnsxZ6uIurfDSaX2u2WU9ZxxlTGeRRSc6zVQ7ndTb24umJufJuFGLaYZMOdyBHc6upJTlSV+nm9Xx6OnpUZmMPn201fp8sTxaHZNPdbM6XSXZ2+1oL1mCkunubWgzM4qjUl1dCqtXb0JLywpMmzYbly79jb17t+Ps2VMVC5BdFOF1ocv2fbbwCI6twC6lPGh1dLyD+fMfxMGDb5vgBGAli57uAA6Y6fesf8/wStEPUs3NK7B4cbNpacePf1XRwKxiF3UUR836pxUWk22fxw9HudCCFkdVEzgRra9Ud1UUnqx3i9Jlsr+rVtFoyoIXJThKghK6z2qT9HXs94qpKDx+KAiX2TAbeLzF2Wrq7u5PzOBk69bXsWzZWrP/W7Nmc9VYJI3HEzxanl2k41aLFho4k5uJMycfQvexhzF4ZQH27r6v5H/p6FiD48e/xsaNHchmu9DcvNyMOKtBhGfnOotGm1wx6he8RQuB7i/mIT1lPmBMh2FMgFID2PZSHVKp37B52/Win712bQD7979mHtUmoyaPaagFhu5e8FB2g3j1lTqk0jNh1MxFTe0CGLWLYNTMg2FMxwvrZ5hwE43WnonrsOqBGVjx6Bx8P/dN1BuTxr2nqOUtxVJMz0z3ZXblqZV/wjAmA0YKRs0swKgH1DUoXpAxEfvf34ATpzb4jm/y5KlaTUyLZl+vx3P9GUxYcj9qZtVhzu+Tsf3yCrxx/fNR77MdpG/JbvHpctZCqdsw1A2oocuA8Z/pNqFuAOomUqk0GhqKd8xeNWPGNLS3t6O/X6952Xt/uQp8cBHGpAkw6icCtQZm1U4d/8ZidxV4Y9Cv7LDTP9+jBq8sUjf7n1a38i+qW/lN6ubAs2rwyiPq+r/1atXK5K6C9ag3Jqlc6i3V99hHqm/5x+rcwg/Vs7VLnN9VYLDCoMUPHTp8G2qoD0NDf2Dozq/moe6chhr6C/mBPL77IcBmrKHyahDrr76Hf368iEvfXsC+M5/iszs/jStIKJvo7N7D8V0ez6/LD/dzlBpEPg88+QwwMKB5bQeg00MX8M3tQfMfv4vuu56gKDxaHoMVvwbqm1+GaWFPtAxizhzg2JfAwcMJODtxrG1X/7bw/HKbokOHh49EzsTZFbspyqJ9npOJ0UTBiltpeYLHD/HDfltfImei4cjGdq7h8UP8cGJ90cjJvVTb6TF+mP8kUfhyAs92qMAUiErZWFQnyVaSvJtuJ1vLY79H9+kkDS2Rf2J9lwIHJ3cVmLeZwAtPtDjWt13ikagkPLYAmnESuIQjprrnCq9SKgmPbpOtgBaYKFjR6gjPaV07uhlLeIn1BS+xOqdBoqOJaVofWwOjT7uEmETexXolPDcG4jgNQpZ4Je4zGHUVXm7SLV3dEmIUdAInzCAm6pzOShItjpbndkLEVQISge3EThNeMufpjxhL7MM+0zDcLqNznT1G9ykPjEhUnmQWZRd2eZrJ8pT6x1bCE0e5gkh3sf56Ci+vcYQneDTvtsIrCWC8SWZQHK8/v4s857BY0yT4fWKFzsW6knFzOcvFy8qYllz6zsIrkb2kq/EDHPzIHhOAtECZVE00XtLHoXCX3I8NGnxZqyBLkSTbKRlGjJasdZSG7tfOGr4tNOEF8cLkIYLJPOiw6InYoOkuvYzlbBXEQzFkE1AP2xBWTLo7Nx3i8xQC3GzP2fZVbsXghZbHoUSpBYKVKNkCBQGuMDYV9IOgrA+BCnsLrLAtj1t9cTNZLtIJ4QGJwVieVRzEy84SbI38udICGloX+7RzOGdaGcsbxvRhKCtjZS8t2QqrUiBaoVFzMdcsV1j7tIX6kHtJoSdE2bBABq06iWWgZVmhsXH6uQGDE4UKTyTJvIQmzymXfSbjao20MlqVNDhe7xRMiQTaiOLyqG3rE5HZ6XO4Ue7K3HIDFp5fHrktQVeM9tjOhLK40okkDYCWJ32j9B+SlOMmOceteF6Zc7TOPdI9yp6jcVNs4IlYYQIShaklqVC6KK5cOo/zpqsSkFagMsMzVo2FFyyg5Ct/34AG9KJ35EYzXXhk7tChDLpNwzBUrK9yjKTCJdCxTgLwdymM395KgIus4MW6NVOrlvASmWqNJNpM5I8SeBorgaexJNpsrfaK0E5A7n8gu1tPvmur0QAAAABJRU5ErkJggg==';
export default image;