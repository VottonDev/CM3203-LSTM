#!/usr/bin/env python

from setuptools import setup, find_packages

with open('README.md', 'r') as f:
    long_description = f.read()

setup(
    name='cm3203',
    version='1.0.0',
    description='CM3203 Dissertation',
    long_description=long_description,
    long_description_content_type='text/markdown',
    author='Otto Hooper',
    author_email='hooperom@cardiff.ac.uk',
    packages=find_packages(),
    install_requires=[
        'numpy~=1.24.2',
        'pandas~=1.5.3',
        'matplotlib==3.7.1',
    ],
)
