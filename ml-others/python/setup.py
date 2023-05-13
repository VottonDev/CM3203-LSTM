#!/usr/bin/env python

from distutils.core import setup

setup(name='cm3203',
      version='1.0',
      description='CM3203 Dissertation',
      author='Otto Hooper',
      author_email='hooperom@cardiff.ac.uk',
      packages=['cm3203'],
      install_requires=['tensorflow', 'numpy', 'scikit-learn', 'kera'],
      )
